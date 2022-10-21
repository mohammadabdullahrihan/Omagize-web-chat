import ChatView from 'layouts/chat/ChatView';
import { useContext, useEffect } from 'react';
import { PageContext } from 'contexts/PageContext';
import { useGroupDetailQuery } from '@omagize/api';

export default function GroupChat() {
  const { selectedGroup, setInfo } = useContext(PageContext);
  const query = useGroupDetailQuery(selectedGroup);
  useEffect(
    () => setInfo(query.isSuccess ? { title: query.data.name } : null),
    [query.data, query.isSuccess]
  );

  return <ChatView />;
}
