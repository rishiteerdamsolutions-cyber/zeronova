import { notFound } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/db";
import { NgoProfile } from "@/models/NgoProfile";

export default async function NgoProfilePage({ params }: { params: { id: string } }) {
  await dbConnect();
  const ngo = await NgoProfile.findById(params.id).populate("userId", "email").lean();
  if (!ngo || ngo.verificationStatus !== "approved") notFound();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            {ngo.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ngo.logoUrl}
                alt={ngo.name}
                className="w-24 h-24 rounded-lg object-cover border border-[var(--border)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-[var(--background-secondary)] flex items-center justify-center text-3xl">
                🌱
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{ngo.name}</h1>
              <Badge className="bg-[var(--success)]/20 text-[var(--success)]">Verified</Badge>
            </div>
            {ngo.description && (
              <p className="text-[var(--foreground-secondary)] mt-2">{ngo.description}</p>
            )}
            <div className="mt-4 space-y-1 text-sm">
              {ngo.contactDetails?.email && (
                <p>Email: <a href={`mailto:${ngo.contactDetails.email}`} className="text-[var(--accent)]">{ngo.contactDetails.email}</a></p>
              )}
              {ngo.contactDetails?.phone && <p>Phone: {ngo.contactDetails.phone}</p>}
              {ngo.contactDetails?.address && <p>Address: {ngo.contactDetails.address}</p>}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Opportunities</h2>
          <Button asChild variant="outline">
            <Link href={`/opportunities?ngo=${params.id}`}>View opportunities</Link>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <h2 className="text-lg font-semibold w-full mb-2">Contact</h2>
          <Button asChild>
            <Link href={`/ngo/${params.id}/contact`}>Contact this NGO</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/volunteer/messages?with=${(ngo.userId as { _id?: { toString: () => string } })?._id?.toString() || ""}`}>
              Message NGO
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
