import React from 'react'
import '../css/sidebar.css'
import { Button } from 'reactstrap';

interface SideBarProps {
  className?: string;
  header: string;
  items: { text: string; color: string }[];
  chooseRange: (range: string) => void;
}

class SideBar extends React.Component<SideBarProps> {
  clickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.props.chooseRange(e.currentTarget.value);
  };
  render() {
    return (
      <div className={this.props.className || "side-bar"}>
        <div className="sidebar-header">{this.props.header}</div>
        <hr />
        {this.props.items.map(({ text, color }) => (
          <Button
            key={text}
            value={text}
            block
            color={color}
            size="lg"
            onClick={this.clickHandler}
          >
            {text}
          </Button>
        ))}
      </div>
    );
  }
}

export default SideBar;