import type { MetaFunction } from '@remix-run/node';
import ClassroomSetup from '../components/ClassroomSetup';

export const meta: MetaFunction = () => {
  return [{ title: 'Coblocks - 강의실 설정' }, { name: 'description', content: '강의실을 설정하고 참여하세요.' }];
};

export default function ClassroomSetupRoute(): JSX.Element {
  return <ClassroomSetup />;
}
