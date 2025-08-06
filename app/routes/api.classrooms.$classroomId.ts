import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { ClassroomInfo, Participants } from '~/assets/dummy/classroomData';


export async function loader({ params }: LoaderFunctionArgs) {
  const { classroomId } = params;

  if (!classroomId) {
    throw new Response('Classroom ID is required', { status: 400 });
  }

  // 실제로는 데이터베이스에서 가져와야 함
  return json({
    classroomInfo: ClassroomInfo,
    participants: Participants,
    
  });
}
