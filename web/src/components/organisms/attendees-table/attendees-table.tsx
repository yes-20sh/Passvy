import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Download,
  CheckCircle2,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import {
  GetRegisteredAttendeesDocument,
  ExportRegisteredAttendeesDocument,
} from '@/gql/graphql';
import { Card } from '@/components/atoms/card/card';
import { Input } from '@/components/atoms/input/input';
import { Button, buttonVariants } from '@/components/atoms/button/button';
import { cn } from '@/lib/utils';
import {
  TypographyH3,
  TypographyMuted,
} from '@/components/atoms/typography/typography';
import { Badge, BadgeVariant } from '@/components/atoms/badge/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from '@/components/atoms/dropdown-menu';

export const AttendeesTable = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [passTypeFilter, setPassTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [exportColumns, setExportColumns] = useState({
    name: true,
    email: true,
    mobileNumber: true,
    passType: true,
    ticketId: true,
    registerDate: true,
    status: true,
  });

  const [exportAttendees, { loading: exporting }] = useLazyQuery(
    ExportRegisteredAttendeesDocument,
  );

  const handleExport = async () => {
    const selectedColumns = Object.entries(exportColumns)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => key);

    if (selectedColumns.length === 0) return;

    try {
      const { data } = await exportAttendees({
        variables: {
          input: {
            slug,
            columns: selectedColumns,
          },
        },
      });

      if (data?.exportRegisteredAttendees) {
        const blob = new Blob([data.exportRegisteredAttendees], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendees-${slug}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export attendees:', err);
    }
  };

  const { data, loading, error } = useQuery(GetRegisteredAttendeesDocument, {
    variables: {
      input: {
        slug,
        search: searchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        passType: passTypeFilter === 'all' ? undefined : passTypeFilter,
        page,
        limit,
      },
    },
    skip: !slug,
    fetchPolicy: 'cache-and-network',
  });

  const attendees = data?.getRegisteredAttendees?.data || [];
  const meta = data?.getRegisteredAttendees?.meta;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-500">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <TypographyH3 className="border-0 font-bold">
            Registered Attendees
          </TypographyH3>
          <TypographyMuted className="text-sm">
            Manage users who have registered for this event.
          </TypographyMuted>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search name, email, ticket..."
              className="bg-background h-9 pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'bg-background text-muted-foreground hover:text-foreground h-9 shrink-0 gap-2 font-normal',
                )}
              >
                <Filter className="h-4 w-4" />
                {statusFilter === 'all' ? 'All Status' : statusFilter}
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <DropdownMenuRadioItem value="all">
                    All Status
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Registered">
                    Registered
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Check-in">
                    Check-in
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'bg-background text-muted-foreground hover:text-foreground h-9 shrink-0 gap-2 font-normal',
                )}
              >
                <Filter className="h-4 w-4" />
                {passTypeFilter === 'all' ? 'All Passes' : passTypeFilter}
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuRadioGroup
                  value={passTypeFilter}
                  onValueChange={setPassTypeFilter}
                >
                  <DropdownMenuRadioItem value="all">
                    All Passes
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="General Admission">
                    General Admission
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="VIP Pass">
                    VIP Pass
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Early Bird">
                    Early Bird
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'h-9 shrink-0 gap-2',
              )}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Export Columns</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={exportColumns.name}
                onCheckedChange={(checked) =>
                  setExportColumns((prev) => ({ ...prev, name: !!checked }))
                }
              >
                Attendee Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={exportColumns.email}
                onCheckedChange={(checked) =>
                  setExportColumns((prev) => ({ ...prev, email: !!checked }))
                }
              >
                Attendee Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={exportColumns.mobileNumber}
                onCheckedChange={(checked) =>
                  setExportColumns((prev) => ({
                    ...prev,
                    mobileNumber: !!checked,
                  }))
                }
              >
                Mobile Number
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={exportColumns.passType}
                onCheckedChange={(checked) =>
                  setExportColumns((prev) => ({ ...prev, passType: !!checked }))
                }
              >
                Pass Type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={exportColumns.ticketId}
                onCheckedChange={(checked) =>
                  setExportColumns((prev) => ({ ...prev, ticketId: !!checked }))
                }
              >
                Ticket ID
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={exportColumns.registerDate}
                onCheckedChange={(checked) =>
                  setExportColumns((prev) => ({
                    ...prev,
                    registerDate: !!checked,
                  }))
                }
              >
                Register Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={exportColumns.status}
                onCheckedChange={(checked) =>
                  setExportColumns((prev) => ({ ...prev, status: !!checked }))
                }
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer justify-center font-medium"
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {exporting ? 'Exporting...' : 'Export'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border-border bg-card/50 overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground border-border border-b bg-transparent">
              <tr>
                <th className="w-16 px-4 py-3 text-center font-medium">
                  S.No.
                </th>
                <th className="px-4 py-3 font-medium">Attendee</th>
                <th className="px-4 py-3 font-medium">Pass Type</th>
                <th className="px-4 py-3 font-medium">Ticket ID</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Register Date
                </th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-destructive py-8 text-center">
                    Failed to load attendees.
                  </td>
                </tr>
              ) : attendees.length > 0 ? (
                attendees.map((attendee, index) => (
                  <tr
                    key={attendee.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="text-muted-foreground px-4 py-3 text-center font-mono text-xs">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground font-medium">
                        {attendee.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {attendee.email}
                        {attendee.mobileNumber && ` • ${attendee.mobileNumber}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={BadgeVariant.Secondary}
                        className="bg-secondary/50 font-medium"
                      >
                        {attendee.passType}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                      {attendee.ticketId}
                    </td>
                    <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                      {new Date(
                        attendee.registerDate as string,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {attendee.status === 'Check-in' && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Check-in
                        </div>
                      )}
                      {attendee.status === 'Registered' && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500">
                          <div className="h-2 w-2 rounded-full bg-indigo-500" />{' '}
                          Registered
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    No attendees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="border-border flex items-center justify-between border-t px-4 py-3">
            <span className="text-muted-foreground text-sm">
              Showing {meta.currentPage} of {meta.totalPages} pages
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!meta.hasPreviousPage}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={!meta.hasNextPage}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
