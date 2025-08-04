import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { ChatMessages } from '~/assets/dummy/classroomData';

// GET 요청 - 메시지 조회
export async function loader({ params }: LoaderFunctionArgs) {
  const { classroomId } = params;

  if (!classroomId) {
    throw new Response('Classroom ID is required', { status: 400 });
  }

  return json(ChatMessages);
}

// POST 요청 - 메시지 전송
export async function action({ request, params }: ActionFunctionArgs) {
  const { classroomId } = params;

  if (!classroomId) {
    throw new Response('Classroom ID is required', { status: 400 });
  }

  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  const body = await request.json();
  const { message } = body;

  if (!message) {
    throw new Response('Message is required', { status: 400 });
  }

  // 새 메시지 생성 (실제로는 데이터베이스에 저장)
  const newMessage = {
    sender: '사용자', // 실제로는 인증된 사용자 정보
    message: message,
    timestamp: new Date().toLocaleTimeString(),
  };

  return json(newMessage, { status: 201 });
}
