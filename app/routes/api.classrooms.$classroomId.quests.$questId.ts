import { json, type ActionFunctionArgs } from '@remix-run/node';
import { Quests } from '~/assets/dummy/classroomData';

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
  const quest = Quests.find((q: { id: number }) => {
    return q.id === parseInt(questId);
  });

  if (!quest) {
    throw new Response('Quest not found', { status: 404 });
  }

  // 상태 업데이트 (실제로는 데이터베이스에서 업데이트)
  const updatedQuest = {
    ...quest,
    status: status,
  };

  return json(updatedQuest);
}
