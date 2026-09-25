import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RecruiterCandidateWorkspace } from './recruiter-candidate-workspace';

export default async function EmployerCandidatesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return <RecruiterCandidateWorkspace />;
}
