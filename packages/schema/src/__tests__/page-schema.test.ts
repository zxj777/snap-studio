import { describe, it, expect } from 'vitest';
import { 
  createEmptyPageSchema, 
  validatePageSchema,
  createApiDataSource,
  createComponent,
  createUpdateStateAction,
  getSchemaStats,
  COMMON_COMPONENT_TYPES,
  type PageSchema
} from '../index.js';

describe('PageSchema', () => {
  describe('createEmptyPageSchema', () => {
    it('should create a valid empty schema', () => {
      const schema = createEmptyPageSchema();
      
      expect(schema).toBeDefined();
      expect(schema.metadata.pageId).toBe('');
      expect(schema.metadata.name).toBe('');
      expect(schema.metadata.version).toBe('1.0');
      expect(schema.loadStrategy.initial).toEqual([]);
      expect(schema.layout.root).toBe('');
      expect(schema.components).toEqual({});
      expect(schema.dataSource).toEqual({});
      expect(schema.actions).toEqual({});
      expect(schema.initialState).toEqual({});
    });
  });

  describe('validatePageSchema', () => {
    it('should validate a correct schema', () => {
      const schema = createEmptyPageSchema();
      schema.metadata.pageId = 'test_page';
      schema.metadata.name = 'Test Page';
      schema.layout.root = 'root_component';
      
      expect(validatePageSchema(schema)).toBe(true);
    });

    it('should reject invalid schemas', () => {
      expect(validatePageSchema(null)).toBe(false);
      expect(validatePageSchema({})).toBe(false);
      expect(validatePageSchema({ metadata: {} })).toBe(false);
    });
  });

  describe('helper functions', () => {
    it('should create API data source correctly', () => {
      const dataSource = createApiDataSource('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      expect(dataSource.type).toBe('API_REQUEST');
      expect(dataSource.config).toEqual({
        url: '/api/users',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should create component correctly', () => {
      const component = createComponent('Button', {
        type: 'primary',
        text: 'Click me'
      });

      expect(component.componentType).toBe('Button');
      expect(component.props).toEqual({
        type: 'primary',
        text: 'Click me'
      });
    });

    it('should create update state action correctly', () => {
      const action = createUpdateStateAction('user.name', 'John Doe');

      expect(action.type).toBe('UPDATE_STATE');
      expect(action.config).toEqual({
        path: 'user.name',
        value: 'John Doe'
      });
    });
  });

  describe('getSchemaStats', () => {
    it('should calculate schema statistics correctly', () => {
      const schema = createEmptyPageSchema();
      schema.components = {
        comp1: { componentType: 'Button' },
        comp2: { componentType: 'Input' },
        comp3: { componentType: 'Button' }
      };
      schema.dataSource = {
        ds1: { type: 'API_REQUEST' },
        ds2: { type: 'STATIC_DATA' }
      };
      schema.actions = {
        act1: { type: 'UPDATE_STATE' }
      };

      const stats = getSchemaStats(schema);

      expect(stats.componentCount).toBe(3);
      expect(stats.dataSourceCount).toBe(2);
      expect(stats.actionCount).toBe(1);
      expect(stats.componentTypes).toEqual({
        Button: 2,
        Input: 1
      });
      expect(stats.dataSourceTypes).toEqual({
        API_REQUEST: 1,
        STATIC_DATA: 1
      });
      expect(stats.actionTypes).toEqual({
        UPDATE_STATE: 1
      });
    });
  });

  describe('constants', () => {
    it('should have common component types', () => {
      expect(COMMON_COMPONENT_TYPES.BUTTON).toBe('Button');
      expect(COMMON_COMPONENT_TYPES.INPUT).toBe('Input');
      expect(COMMON_COMPONENT_TYPES.TABLE).toBe('Table');
    });
  });

  describe('complex schema example', () => {
    it('should handle a complex schema with all features', () => {
      const schema: PageSchema = {
        metadata: {
          pageId: 'user_dashboard',
          name: 'User Dashboard',
          version: '1.0.0',
          description: 'A dashboard showing user information',
          seo: {
            title: 'User Dashboard',
            description: 'View and manage user information'
          }
        },
        loadStrategy: {
          initial: ['ds_user_info', 'comp_header'],
          preload: ['comp_user_modal'],
          onDemand: {
            'act_open_modal': ['ds_user_details']
          }
        },
        layout: {
          root: 'comp_page_container',
          structure: {
            comp_page_container: {
              children: ['comp_user_table', 'comp_load_button']
            }
          }
        },
        components: {
          comp_page_container: {
            componentType: 'Container',
            props: { padding: 16 }
          },
          comp_user_table: {
            componentType: 'Table',
            props: {
              columns: [
                { key: 'name', title: 'Name' },
                { key: 'email', title: 'Email' }
              ]
            },
            dataBinding: {
              dataSource: 'state.userList'
            }
          },
          comp_load_button: {
            componentType: 'Button',
            props: { type: 'primary', text: 'Load Users' },
            events: { onClick: 'act_load_users' }
          },
          comp_header: {
            componentType: 'Header',
            props: { title: 'Dashboard' }
          },
          comp_footer: {
            componentType: 'Footer',
            props: { copyright: '2024' }
          }
        },
        dataSource: {
          ds_user_info: {
            type: 'API_REQUEST',
            config: {
              url: '/api/users',
              method: 'GET'
            },
            onSuccess: 'act_update_user_list'
          },
          ds_static_welcome: {
            type: 'STATIC_DATA',
            config: { value: 'Welcome!' }
          }
        },
        actions: {
          act_load_users: {
            type: 'COMPOSITE',
            config: {
              steps: ['act_set_loading', 'act_fetch_users', 'act_clear_loading'],
              mode: 'sequence'
            }
          },
          act_fetch_users: {
            type: 'FETCH_DATA',
            config: {
              dataSourceId: 'ds_user_info',
              resultPath: 'userList'
            }
          },
          act_update_user_list: {
            type: 'UPDATE_STATE',
            config: {
              path: 'userList',
              value: '{{response.data}}'
            }
          },
          act_set_loading: {
            type: 'UPDATE_STATE',
            config: {
              path: 'loading',
              value: true
            }
          },
          act_clear_loading: {
            type: 'UPDATE_STATE',
            config: {
              path: 'loading',
              value: false
            }
          }
        },
        initialState: {
          userList: [],
          loading: false,
          currentUser: null
        },
        computed: {
          userCount: {
            dependencies: ['state.userList'],
            expression: '{{state.userList.length}}'
          }
        },
        lifecycle: {
          onLoad: ['act_load_users'],
          onUnload: ['act_cleanup']
        }
      };

      expect(validatePageSchema(schema)).toBe(true);
      
      const stats = getSchemaStats(schema);
      expect(stats.componentCount).toBe(5);
      expect(stats.dataSourceCount).toBe(2);
      expect(stats.actionCount).toBe(5);
    });
  });
}); 