import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { EventSchema } from '@/schemas/event.schema';
import { EventPromotionSchema } from '@/schemas/event-promotion.schema';
import { SavedEventSchema } from '@/schemas/saved-event.schema';
import { CreateEventInput, PromoteEventInput } from './dto/event.dto';
import { GoogleService } from '@/config/google/google.service';
import { EventResponse } from './entities/event.response.entity';
import {
  EventStep,
  EventMode,
  EventRelation,
  BlockType,
  PromotionImageSource,
} from '@/enum';
import { generateEventMeetLinkHelper } from '@/helper/generate-meet-link/generate-meet-link.helper';
import { CloudinaryService } from '@/config/cloudinary/cloudinary.service';
import { uploadEventImageHelper } from '@/helper/cloudinary/cloudinary.helper';
import { generateSlugHelper } from '@/helper/generate-slug/generate-slug.helper';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(EventSchema)
    private readonly eventRepository: Repository<EventSchema>,
    @InjectRepository(EventPromotionSchema)
    private readonly promotionRepository: Repository<EventPromotionSchema>,
    @InjectRepository(SavedEventSchema)
    private readonly savedEventRepository: Repository<SavedEventSchema>,
    private readonly googleService: GoogleService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createEvent(
    userId: string,
    input: CreateEventInput,
  ): Promise<EventResponse> {
    try {
      let event: EventSchema;

      if (input.eventId) {
        const existingEvent = await this.eventRepository.findOne({
          where: { id: input.eventId, creatorId: userId },
          relations: {
            mode: true,
            paymentSetting: true,
            descriptionBlocks: true,
            passes: true,
            coupons: true,
          },
        });

        if (!existingEvent) {
          throw new NotFoundException('Event not found or unauthorized');
        }

        const {
          eventMode,
          onlineLink,
          offlineAddress,
          offlineMapLink,
          offlineLandmark,
          city,
          state,
          country,
          capacity,
          paymentSetting,
          descriptionBlocks,
          passes,
          coupons,
          ...restInput
        } = input;

        if (eventMode) {
          if (!existingEvent.mode) {
            existingEvent.mode = this.eventRepository.manager.create(
              'EventModeSchema',
              {
                eventMode,
                onlineLink,
                offlineAddress,
                offlineMapLink,
                offlineLandmark,
                city,
                state,
                country,
                capacity,
              },
            );
          } else {
            if (eventMode !== undefined)
              existingEvent.mode.eventMode = eventMode;
            if (onlineLink !== undefined)
              existingEvent.mode.onlineLink = onlineLink;
            if (offlineAddress !== undefined)
              existingEvent.mode.offlineAddress = offlineAddress;
            if (offlineMapLink !== undefined)
              existingEvent.mode.offlineMapLink = offlineMapLink;
            if (offlineLandmark !== undefined)
              existingEvent.mode.offlineLandmark = offlineLandmark;
            if (city !== undefined) existingEvent.mode.city = city;
            if (state !== undefined) existingEvent.mode.state = state;
            if (country !== undefined) existingEvent.mode.country = country;
            if (capacity !== undefined) existingEvent.mode.capacity = capacity;
          }
        }

        if (paymentSetting) {
          if (!existingEvent.paymentSetting) {
            existingEvent.paymentSetting = this.eventRepository.manager.create(
              'EventPaymentSettingSchema',
              paymentSetting,
            );
          } else {
            Object.assign(existingEvent.paymentSetting, paymentSetting);
          }
        }

        if (descriptionBlocks) {
          if (existingEvent.descriptionBlocks?.length) {
            await this.eventRepository.manager.remove(
              existingEvent.descriptionBlocks,
            );
          }
          existingEvent.descriptionBlocks = descriptionBlocks.map((b) =>
            this.eventRepository.manager.create(
              'EventDescriptionBlockSchema',
              b,
            ),
          );
        }

        if (passes) {
          if (existingEvent.passes?.length) {
            await this.eventRepository.manager.remove(existingEvent.passes);
          }
          existingEvent.passes = passes.map((p) =>
            this.eventRepository.manager.create('EventPassSchema', p),
          );
        }

        if (coupons) {
          if (existingEvent.coupons?.length) {
            await this.eventRepository.manager.remove(existingEvent.coupons);
          }
          existingEvent.coupons = coupons.map((c) =>
            this.eventRepository.manager.create('EventCouponSchema', c),
          );
        }

        // Apply remaining scalar updates
        Object.assign(existingEvent, restInput);
        event = existingEvent;
      } else {
        event = this.eventRepository.create({
          ...input,
          creatorId: userId,
          slug: generateSlugHelper(input.title),
        });
      }

      // Upload Header Image if it's base64
      if (input.headerImage && input.headerImage.startsWith('data:image')) {
        event.headerImage = await uploadEventImageHelper(
          this.cloudinaryService,
          input.headerImage,
          'passvy/events/headers',
        );
      }

      // Check description blocks for images and upload them
      if (event.descriptionBlocks && event.descriptionBlocks.length > 0) {
        for (const block of event.descriptionBlocks) {
          if (
            block.blockType === BlockType.IMAGE &&
            block.content &&
            block.content.startsWith('data:image')
          ) {
            block.content = await uploadEventImageHelper(
              this.cloudinaryService,
              block.content,
              'passvy/events/description-blocks',
            );
          }
        }
      }

      if (
        event.stepper === EventStep.MODE &&
        event.mode?.eventMode === EventMode.ONLINE &&
        !event.mode?.onlineLink && // Ensure we only generate once
        event.startDate &&
        event.endDate
      ) {
        const meetLink = await generateEventMeetLinkHelper(this.googleService, {
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
        });

        if (!event.mode) {
          event.mode = this.eventRepository.manager.create('EventModeSchema', {
            eventMode: EventMode.ONLINE,
          });
        }
        event.mode.onlineLink = meetLink;
      }

      // Save the event (draft or otherwise)
      const savedEvent = await this.eventRepository.save(event);

      return {
        message: input.eventId
          ? 'Event updated successfully'
          : 'Event created successfully',
        event: savedEvent,
      };
    } catch (error) {
      this.logger.error('Failed to save event', error);
      throw new InternalServerErrorException('Failed to save event');
    }
  }

  async getEvent(
    slug: string,
    userId?: string,
    isCreatorDashboard: boolean = false,
  ): Promise<EventResponse> {
    try {
      const whereClause: FindOptionsWhere<EventSchema> = { slug };
      if (userId && isCreatorDashboard) {
        whereClause.creatorId = userId;
      }

      const event = await this.eventRepository.findOne({
        where: whereClause,
        relations: {
          [EventRelation.MODE]: true,
          [EventRelation.DESCRIPTION_BLOCKS]: true,
          [EventRelation.PASSES]: true,
          [EventRelation.COUPONS]: true,
          [EventRelation.PAYMENT_SETTING]: true,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found or unauthorized');
      }

      // Convert string dates from Postgres back to Date objects for GraphQL serialization
      if (event.startDate && typeof event.startDate === 'string') {
        event.startDate = new Date(event.startDate);
      }
      if (event.endDate && typeof event.endDate === 'string') {
        event.endDate = new Date(event.endDate);
      }
      if (event.mode) {
        // Hide the meet link for public requests on online events
        if (!isCreatorDashboard && event.mode.eventMode === EventMode.ONLINE) {
          event.mode.onlineLink = null;
        }

        if (
          event.mode.meetingStartDate &&
          typeof event.mode.meetingStartDate === 'string'
        ) {
          event.mode.meetingStartDate = new Date(event.mode.meetingStartDate);
        }
        if (
          event.mode.meetingEndDate &&
          typeof event.mode.meetingEndDate === 'string'
        ) {
          event.mode.meetingEndDate = new Date(event.mode.meetingEndDate);
        }
      }

      let isSaved = false;
      if (userId) {
        const savedEvent = await this.savedEventRepository.findOne({
          where: { userId, eventId: event.id },
        });
        isSaved = !!savedEvent;
      }

      return {
        message: userId
          ? 'Event fetched successfully'
          : 'Event details fetched successfully',
        event,
        isSaved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to fetch event', error);
      throw new InternalServerErrorException('Failed to fetch event');
    }
  }

  async promoteEvent(
    userId: string,
    input: PromoteEventInput,
  ): Promise<boolean> {
    try {
      const event = await this.eventRepository.findOne({
        where: { slug: input.eventSlug, creatorId: userId },
      });

      if (!event) {
        throw new NotFoundException('Event not found or unauthorized');
      }

      let imageUrl = input.imageUrl || null;

      if (
        input.imageSource === PromotionImageSource.UPLOAD &&
        input.imageUrl &&
        input.imageUrl.startsWith('data:image')
      ) {
        imageUrl = await uploadEventImageHelper(
          this.cloudinaryService,
          input.imageUrl,
          'passvy/events/promotions',
        );
      } else if (input.imageSource === PromotionImageSource.HEADER) {
        imageUrl = event.headerImage;
      }

      const promotion = this.promotionRepository.create({
        eventId: event.id,
        duration: input.duration,
        startDate: input.startDate,
        endDate: input.endDate,
        imageSource: input.imageSource,
        imageUrl,
      });

      await this.promotionRepository.save(promotion);

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to promote event', error);
      throw new InternalServerErrorException('Failed to promote event');
    }
  }

  async getEventPromotions(
    userId: string,
    eventSlug: string,
  ): Promise<EventPromotionSchema[]> {
    try {
      const event = await this.eventRepository.findOne({
        where: { slug: eventSlug, creatorId: userId },
      });

      if (!event) {
        throw new NotFoundException('Event not found or unauthorized');
      }

      return this.promotionRepository.find({
        where: { eventId: event.id },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to fetch event promotions', error);
      throw new InternalServerErrorException(
        'Failed to fetch event promotions',
      );
    }
  }
}
