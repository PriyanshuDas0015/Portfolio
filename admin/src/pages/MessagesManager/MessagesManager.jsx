import { useEffect, useState } from 'react';
import { MailOpen, Mail, Trash2, X, Archive, Reply } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading/Loading';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
export default function MessagesManager() {
  const notify = useToast();
  const { refreshUnread } = useOutletContext();
  const [items, setItems] = useState(null);
  const [open, setOpen] = useState(null);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const load = () =>
    adminApi
      .list('messages')
      .then((d) => setItems(d.items))
      .catch((e) => notify(e.message, 'error'));
  useEffect(() => {
    load();
  }, [notify]);
  const mark = async (item, isRead) => {
    try {
      const data = await adminApi.markMessage(item._id, isRead);
      setItems((v) => v.map((x) => (x._id === item._id ? data.item : x)));
      if (open?._id === item._id) setOpen(data.item);
      refreshUnread();
    } catch (e) {
      notify(e.message, 'error');
    }
  };
  const view = (item) => {
    setOpen(item);
    if (!item.isRead) mark(item, true);
  };
  const status = async (item, nextStatus) => {
    try {
      const data = await adminApi.setMessageStatus(item._id, nextStatus);
      setItems((value) => value.map((x) => (x._id === item._id ? data.item : x)));
      refreshUnread();
      notify(nextStatus === 'archived' ? 'Message archived' : 'Message updated');
    } catch (e) {
      notify(e.message, 'error');
    }
  };
  const confirm = async () => {
    setBusy(true);
    try {
      await adminApi.remove('messages', remove._id);
      setItems((v) => v.filter((x) => x._id !== remove._id));
      if (open?._id === remove._id) setOpen(null);
      setRemove(null);
      refreshUnread();
      notify('Message deleted');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  if (!items) return <Loading label="Loading messages..." />;
  return (
    <>
      <div className="page-heading">
        <div>
          <span>CONTACT INBOX</span>
          <h1>Messages</h1>
          <p>Read and manage messages submitted from the public portfolio.</p>
        </div>
      </div>
      <div className="list-toolbar form-panel">
        <input
          placeholder="Search messages…"
          aria-label="Search messages"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter messages"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="messages-list">
        {items
          .filter(
            (item) =>
              `${item.name} ${item.email} ${item.message}`
                .toLowerCase()
                .includes(search.toLowerCase()) &&
              (filter === 'all' || (item.status || (item.isRead ? 'read' : 'unread')) === filter),
          )
          .map((item) => (
            <article className={item.isRead ? 'read' : 'unread'} key={item._id}>
              <button className="message-main" onClick={() => view(item)}>
                <span className="message-state">{item.isRead ? <MailOpen /> : <Mail />}</span>
                <div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.email}</span>
                  </div>
                  <p>{item.message}</p>
                </div>
                <time>{new Date(item.createdAt).toLocaleDateString()}</time>
              </button>
              <div className="row-actions">
                <button onClick={() => mark(item, !item.isRead)}>
                  {item.isRead ? 'Mark unread' : 'Mark read'}
                </button>
                <button className="danger-text" onClick={() => setRemove(item)}>
                  <Trash2 />
                  Delete
                </button>
                <button onClick={() => status(item, 'archived')}>
                  <Archive />
                  Archive
                </button>
              </div>
            </article>
          ))}
        {items.length === 0 && (
          <div className="empty-state">
            <Mail />
            <h2>Your inbox is clear</h2>
            <p>New portfolio messages will appear here.</p>
          </div>
        )}
      </div>
      {open && (
        <div className="modal-backdrop">
          <section className="message-modal">
            <header>
              <div>
                <span>{open.isRead ? 'READ' : 'UNREAD'} MESSAGE</span>
                <h2>{open.name}</h2>
                <a href={`mailto:${open.email}`}>{open.email}</a>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Close">
                <X />
              </button>
            </header>
            <p>{open.message}</p>
            <time>{new Date(open.createdAt).toLocaleString()}</time>
            <a
              className="admin-button primary"
              href={`mailto:${open.email}?subject=Re: Portfolio enquiry`}
            >
              <Reply />
              Reply by email
            </a>
          </section>
        </div>
      )}
      {remove && (
        <ConfirmModal
          title="Delete Message?"
          description={`Delete the message from ${remove.name}? This cannot be undone.`}
          busy={busy}
          onCancel={() => setRemove(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
