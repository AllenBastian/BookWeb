import React from 'react';

const NotifComp = ({ title, description, date, read, markAsRead }) => {
  return (
    <div className={`notification ${read ? 'read' : 'unread'} bg-white rounded-lg shadow-md p-6 mb-4`}>
      <div className="notification-content">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-2">{date}</p>
      </div>
      {!read && <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={markAsRead}>Mark as Read</button>}
    </div>
  );
};

export default NotifComp;
