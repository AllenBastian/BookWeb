import React, { useState } from 'react';
import NotifComp from '../components/notifcomp';

const Inbox = () => {
  const [notifications, setNotifications] = useState([
    
    {
      id: 1,
      title: 'New Chapter Available',
      description: 'Chapter 10 of "The Great Adventure" has been published.',
      date: '2024-04-2',
      read: false,
    },
    {
      id: 2,
      title: 'Author Update',
      description: 'An update from your favorite author has been posted.',
      date: '2024-04-25',
      read: true,
    },
    // Add more notification objects as needed
  ]);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  return (
    <div className="notification-inbox">
      
      <ul>
        {notifications.map((notification) => (
          <NotifComp
            key={notification.id}
            title={notification.title}
            description={notification.description}
            date={notification.date}
            read={notification.read}
            markAsRead={() => markAsRead(notification.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Inbox;
