import { OperationReservation } from '../../../workspace/operation';
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <OperationReservation id={id}/>; }
