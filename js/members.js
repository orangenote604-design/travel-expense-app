let memberList = [];

document.addEventListener('DOMContentLoaded', async () => {
  setLoading(true, '画面を読み込み中...');
  try {
    document.getElementById('searchMemberButton').addEventListener('click', renderMembers);
    document.getElementById('clearMemberButton').addEventListener('click', clearSearch);
    document.getElementById('memberTableBody').addEventListener('click', handleTableClick);
    await loadMembers();
  } finally {
    setLoading(false);
  }
});

async function loadMembers() {
  try {
    memberList = await apiGet('listMembers');
    renderMembers();
  } catch (error) {
    setMessage('部員一覧の取得に失敗しました。', 'error');
    console.error(error);
  }
}

function clearSearch() {
  document.getElementById('memberSearch').value = '';
  renderMembers();
}

function renderMembers() {
  const keyword = document.getElementById('memberSearch').value.trim().toLowerCase();
  const rows = memberList.filter(name => !keyword || String(name).toLowerCase().includes(keyword));
  const tbody = document.getElementById('memberTableBody');
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="2">データがありません。</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(name => `
    <tr>
      <td>${escapeHtml(name)}</td>
      <td><div class="button-row"><a href="member-edit.html?name=${encodeURIComponent(name)}" class="button-link secondary">編集</a><button type="button" class="danger delete-member-button" data-name="${escapeHtml(name)}">削除</button></div></td>
    </tr>`).join('');
}

async function handleTableClick(event) {
  const button = event.target.closest('.delete-member-button');
  if (!button) return;
  const name = button.dataset.name;
  if (!confirm(`部員「${name}」を削除しますか？`)) return;
  try {
    setLoading(true, '削除中...');
    const result = await apiPost({ action: 'deleteMember', name });
    if (!result.ok) {
      setMessage(result.error || '削除に失敗しました。', 'error');
      return;
    }
    setMessage(`削除しました: ${name}`, 'success');
    await loadMembers();
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
