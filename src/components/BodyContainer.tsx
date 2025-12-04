import React from "react";
import SideBar from "./SideBar";
import MainContentContainer from "./MainContentContainer";
import "../css/bodyContainer.css";

const additionItems = [
	{ text: "Less Than 10", color: "success" },
	{ text: "Less Than 20", color: "primary" },
	{ text: "Less Than 30", color: "warning" },
	{ text: "Less Than 40", color: "info" },
	{ text: "Less Than 50", color: "danger" },
	{ text: "Less Than 60", color: "secondary" },
	{ text: "Less Than 70", color: "success" },
	{ text: "Less Than 80", color: "warning" },
	{ text: "Less Than 90", color: "info" },
	{ text: "Less Than 100", color: "danger" },
];

interface BodyContainerState {
	range: string;
}

class BodyContainer extends React.Component<{}, BodyContainerState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			range: "",
		};
	}

	getRange = (range: string) => {
		this.setState({
			range: range,
		});
	};

	render() {
		return (
			<div className="body-container">
				<SideBar
					className="side-bar"
					header="Addition"
					items={additionItems}
					chooseRange={this.getRange}
				/>
				<MainContentContainer
					className="main-container"
					range={this.state.range}
				/>
			</div>
		);
	}
}

export default BodyContainer;
