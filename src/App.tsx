import { Navbar, Dropdown, Button } from 'flowbite-react';
import DynamicForm, { FabricEPConfig } from './DynamicForm';

const ListItems = [
  {
    id: '1',
    title: 'a title',
    views: 100,
  },
  {
    id: '2',
    title: 'another title',
    views: 200,
  },
];

const dummyServer = (params: {
  method: string;
  query?: Record<string, any>;
  body?: Record<string, any>;
}): Record<string, any> | Record<string, any>[] => {
  if (params.method === 'GET' && (params?.query?.id || params?.query?.uid)) {
    return Promise.resolve(ListItems[0]);
  }
  return Promise.resolve(ListItems);
};

const fabricEPConfig: FabricEPConfig = {
  url: '/api/items',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      isNullable: false,
      isPostable: false,
      isPutable: false,
      isPatchable: false,
      shouldShowInListView: true,
    },
    {
      key: 'title',
      label: 'Title',
      placeHolder: 'Enter title',
      type: 'text',
      validator: 'string',
      isNullable: false,
      isPostable: true,
      isPutable: true,
      isPatchable: true,
      shouldShowInListView: true,
    },
    {
      key: 'views',
      label: 'Views',
      placeHolder: 'Enter view count',
      type: 'number',
      validator: (value: any) => {
        if (typeof value === 'number') {
          return { status: true };
        }
        return { status: false, message: 'Views must be a number' };
      },
      isNullable: false,
      isPostable: true,
      isPutable: true,
      isPatchable: true,
      shouldShowInListView: true,
    },
  ],
  validator: (formData: Record<string, any>) => {
    if (!formData.title) {
      return { status: false, message: 'Title is required' };
    }
    if (typeof formData.views !== 'number') {
      return { status: false, message: 'Views must be a number' };
    }
    return { status: true };
  },
  shouldShowInMenu: true,
  type: 'table',
  endpoints: [],
};

function App() {
  return (
    <div className="App">
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="/">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Flowbite
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown inline={true} label="Login">
            <Dropdown.Header>
              <span className="block text-sm">User Name</span>
              <span className="block truncate text-sm font-medium">
                user@example.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Sign Out</Dropdown.Item>
          </Dropdown>
          <Button className="ml-2">Sign Up</Button>
        </div>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link href="/" active={true}>
            Home
          </Navbar.Link>
          <Navbar.Link href="/about">About</Navbar.Link>
          <Navbar.Link href="/services">Services</Navbar.Link>
          <Navbar.Link href="/contact">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <DynamicForm
        apiClient={dummyServer}
        fabricEPConfig={[fabricEPConfig]}
      ></DynamicForm>
    </div>
  );
}

export default App;
