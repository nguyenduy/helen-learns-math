import React from 'react'
import '../css/sidebar.css'
import { Button } from 'reactstrap';

interface SideBarProps {
  className?: string;
  header: string;
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
          <span className="sidebar-title">{this.props.header}</span>
        </div>
        <hr />
        <div className={`sidebar-body ${this.state.compact ? 'hidden' : ''}`}>
          {this.props.items.map(({ text, color }) => (
            <Button
              key={text}
              value={text}
              block
              color={color}
              size="lg"
              onClick={(e) => { this.clickHandler(e); this.close(); }}
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
                <span className="sidebar-title">{this.props.header}</span>
              </div>
              <div className="drawer-body">
                {this.props.items.map(({ text, color }, idx) => (
                  <Button
                    key={text}
                    value={text}
                    block
                    color={color}
                    size="lg"
                    innerRef={idx === 0 ? this.firstButtonRef : undefined}
                    onClick={(e) => { this.clickHandler(e); this.close(); }}
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