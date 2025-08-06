import {type ActionFunctionArgs } from '@remix-run/node';
import  {classroomService} from '~/services/classroomService';

// PUT 요청 - 퀘스트 상태 업데이트
export async function action({ request, params }: ActionFunctionArgs) {
  const { classroomId, questId } = params;

  if (!classroomId || !questId) {
    throw new Response('Classroom ID and Quest ID are required', { status: 400 });
  }

  if (request.method !== 'PUT') {
    throw new Response('Method not allowed', { status: 405 });
  }

  const body = await request.json();
  const { status } = body;

  if (!status) {
    throw new Response('Status is required', { status: 400 });
  }

  // 퀘스트 찾기
  const data = await classroomService.getQuests();

  return data;
}
