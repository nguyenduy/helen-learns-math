import React from 'react'
import '../css/sidebar.css'
import { Button, Select } from 'antd';
const { Option } = Select;

const colorMap: Record<string, string> = {
  success: '#28a745',
  primary: '#007bff',
  warning: '#f0ad4e',
  info: '#17a2b8',
  danger: '#dc3545',
  secondary: '#6c757d'
};

function getTextColor(variant: string) {
  if (variant === 'warning') return '#222';
  if (variant === 'info') return '#fff';
  return '#fff';
}

interface SideBarProps {
  className?: string;
  header: string;
  operation?: string;
  onOperationChange?: (op: string) => void;
  items: { text: string; color: string }[];
  chooseRange: (range: string) => void;
}

class SideBar extends React.Component<SideBarProps, { compact: boolean; drawerOpen: boolean }> {
  drawerRef: React.RefObject<HTMLElement>;
  firstButtonRef: React.RefObject<HTMLButtonElement>;
  resizeHandler: () => void;

  constructor(props: SideBarProps) {
    super(props);
    const isCompact = globalThis.window !== undefined ? globalThis.window.innerWidth <= 720 : false;
    this.state = { compact: isCompact, drawerOpen: false };
    this.drawerRef = React.createRef<HTMLElement>();
    this.firstButtonRef = React.createRef<HTMLButtonElement>();
    this.resizeHandler = () => this.setState({ compact: window.innerWidth <= 720 });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  clickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.chooseRange(e.currentTarget.value);
  };

  toggleCollapsed = () => {
    if (this.state.compact) {
      // open overlay drawer on small screens
      this.setState({ drawerOpen: true }, () => {
        requestAnimationFrame(() => this.firstButtonRef.current?.focus());
        document.addEventListener('keydown', this.handleKeyDown);
      });
    } else {
      // toggle compact mode on larger screens
      this.setState((s) => ({ compact: !s.compact }));
    }
  };

  close = () => {
    this.setState({ drawerOpen: false }, () => {
      document.removeEventListener('keydown', this.handleKeyDown);
      // restore focus to the toggle button if present
      const toggle = document.querySelector('.sidebar-toggle');
      if (toggle instanceof HTMLElement) toggle.focus();
    });
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.close();
    }
    // simple focus trap: keep TAB navigation inside drawer
    if (e.key === 'Tab' && this.state.drawerOpen && this.drawerRef.current) {
      const focusable = this.drawerRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
  };

  render() {
    const wrapperClass = `${this.props.className || 'side-bar'} ${this.state.compact ? 'collapsed' : ''}`;
    return (
      <div className={wrapperClass}>
        <div className="sidebar-header">
          <button type="button" className="sidebar-toggle" onClick={this.toggleCollapsed} aria-label="Toggle sidebar">☰</button>
          <div className="sidebar-title">
            <Select
              id="operation-select"
              value={this.props.operation || this.props.header}
              onChange={(val) => this.props.onOperationChange?.(val)}
              aria-label="Select operation"
              bordered={false}
              size="large"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 200 }}
              style={{ width: '100%', paddingRight: 36, textAlign: 'center' }}
              optionLabelProp="children"
            >
              <Option value="Addition">Addition</Option>
              <Option value="Subtraction">Subtraction</Option>
            </Select>
          </div>
        </div>
        <hr />
        <div className={`sidebar-body ${this.state.compact ? 'hidden' : ''}`}>
          {this.props.items.map(({ text, color }) => (
            <Button
              key={text}
              onClick={(e) => { this.props.chooseRange(text); this.close(); }}
              type="default"
              size="large"
              style={{
                width: '95%',
                marginBottom: 8,
                background: colorMap[color] || '#eee',
                color: getTextColor(color),
                border: 'none'
              }}
            >
              {text}
            </Button>
          ))}
        </div>

        {/* Overlay / drawer for small screens */}
        {this.state.drawerOpen && (
          <>
            <button
              type="button"
              className="sidebar-overlay-button"
              onClick={this.close}
              aria-label="Close sidebar"
            ></button>

            <aside className="sidebar-drawer" ref={this.drawerRef} aria-modal="true" role="dialog">
                <div className="drawer-header">
                <button type="button" className="sidebar-toggle" onClick={this.close} aria-label="Close sidebar">✕</button>
                <div className="sidebar-title">
                  <Select
                    id="drawer-operation-select"
                    value={this.props.operation || this.props.header}
                    onChange={(val) => this.props.onOperationChange?.(val)}
                    aria-label="Select operation"
                    bordered={false}
                    size="large"
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ minWidth: 200 }}
                    style={{ width: '100%', paddingRight: 36, textAlign: 'center' }}
                    optionLabelProp="children"
                  >
                    <Option value="Addition">Addition</Option>
                    <Option value="Subtraction">Subtraction</Option>
                  </Select>
                </div>
              </div>
              <div className="drawer-body">
                {this.props.items.map(({ text, color }, idx) => (
                  <Button
                    key={text}
                    onClick={() => { this.props.chooseRange(text); this.close(); }}
                    type="default"
                    size="large"
                    style={{
                      width: '100%',
                      background: colorMap[color] || '#eee',
                      color: getTextColor(color),
                      border: 'none'
                    }}
                    ref={idx === 0 ? this.firstButtonRef as any : undefined}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </aside>
          </>
        )}
      </div>
    );
  }
}

export default SideBar;