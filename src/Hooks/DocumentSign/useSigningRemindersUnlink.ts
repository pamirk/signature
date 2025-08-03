import { useAsyncAction } from 'Hooks/Common';
import DocumentSignApi from 'Services/Api/DocumentSign';

// TODO: Remove this import when the API is ready
const useSigningRemindersUnlink = () => {
  return useAsyncAction(async ({ signerId }: { signerId: string }) => {
    await DocumentSignApi.unlinkSigningReminders({
      token: undefined, // token is handled globally
      payload: { signerId },
    });
  });
};

export default useSigningRemindersUnlink;
