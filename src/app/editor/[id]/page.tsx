import EditorPage from "../page";

interface EditResumePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditResumePage({ params }: EditResumePageProps) {
  const resolvedParams = await params;
  return <EditorPage params={resolvedParams} />;
}
