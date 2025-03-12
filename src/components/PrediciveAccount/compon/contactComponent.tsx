import { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

// Define a type for contact data
export interface Contact {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  category: 'frequent' | 'recent' | 'all';
}

interface ContactListProps {
  contacts: Contact[];
}

const ContactList = ({ contacts }: ContactListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedContact, setExpandedContact] = useState<number | null>(null);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dropdown for a contact
  const toggleDropdown = (contactId: number) => {
    if (expandedContact === contactId) {
      setExpandedContact(null);
    } else {
      setExpandedContact(contactId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Contacts</h2>

        {/* Search box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Contact list */}
      <div className="max-h-[400px] overflow-y-auto">
        <ul>
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <li key={contact.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="px-4 py-3">
                  <button
                    className="w-full flex items-center justify-between"
                    onClick={() => toggleDropdown(contact.id)}
                  >
                    <div className="flex items-center">
                      <img
                        src={contact.imageUrl}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div className="text-left">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{contact.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${expandedContact === contact.id ? 'transform rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown content */}
                  {expandedContact === contact.id && (
                    <div className="mt-2 pl-13 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 ml-10">
                      <div className="space-y-2">
                        <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-800 dark:text-gray-200">
                          Send Money
                        </button>
                        <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-800 dark:text-gray-200">
                          Request Money
                        </button>
                        <button className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-800 dark:text-gray-200">
                          Transaction History
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No contacts found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContactList;