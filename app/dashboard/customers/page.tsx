import { Suspense } from 'react';
import Pagination from '@/app/ui/invoices/pagination';
import Table from '@/app/ui/customers/table';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchFilteredCustomers } from '@/app/lib/data';

export default async function Page({
    searchParams
}: {
    searchParams?: {
        query?: string;
        page?: string;
    }
}) {

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const customers = await fetchFilteredCustomers(query);

    return (
        <div className="w-full">
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table customers={customers} />
            </Suspense>
        </div>
    );
}