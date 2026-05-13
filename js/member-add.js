document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('memberAddForm').addEventListener('submit', submitMember);
});

async function submitMember(event) {
  event.preventDefault();
  clearMessage();
  const name = document.getElementById('memberName').value.trim();
  if (!name) {
    setMessage('氏名を入力してください。', 'error');
    return;
  }
  try {
    const result = await apiPost({ action: 'addMember', name });
    if (!result.ok) {
      setMessage(result.error || '登録に失敗しました。', 'error');
      return;
    }
    setMessage(`登録しました: ${result.name}`, 'success');
    document.getElementById('memberAddForm').reset();
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  }
}
