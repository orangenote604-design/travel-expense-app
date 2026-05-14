document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('memberEditForm').addEventListener('submit', updateMember);
  document.getElementById('deleteButton').addEventListener('click', deleteMember);
  initPage();
});

function initPage() {
  const name = getQueryParam('name') || '';
  document.getElementById('currentName').value = name;
  document.getElementById('newName').value = name;
  if (!name) setMessage('対象の部員名が指定されていません。', 'error');
}

async function updateMember(event) {
  event.preventDefault();
  clearMessage();
  const oldName = document.getElementById('currentName').value.trim();
  const newName = document.getElementById('newName').value.trim();
  if (!oldName || !newName) {
    setMessage('氏名を入力してください。', 'error');
    return;
  }
  try {
    setLoading(true, '更新中...');
    const result = await apiPost({ action: 'updateMember', oldName, newName });
    if (!result.ok) {
      setMessage(result.error || '更新に失敗しました。', 'error');
      return;
    }
    setMessage(`更新しました: ${result.oldName} → ${result.newName}`, 'success');
    document.getElementById('currentName').value = result.newName;
    history.replaceState(null, '', `member-edit.html?name=${encodeURIComponent(result.newName)}`);
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function deleteMember() {
  clearMessage();
  const name = document.getElementById('currentName').value.trim();
  if (!name) {
    setMessage('削除対象がありません。', 'error');
    return;
  }
  if (!confirm(`部員「${name}」を削除しますか？`)) return;
  try {
    setLoading(true, '削除中...');
    const result = await apiPost({ action: 'deleteMember', name });
    if (!result.ok) {
      setMessage(result.error || '削除に失敗しました。', 'error');
      return;
    }
    location.href = 'members.html';
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
