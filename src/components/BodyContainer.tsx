import React from "react";
import SideBar from "./SideBar";
import MainContentContainer from "./MainContentContainer";
import "../css/bodyContainer.css";

const additionItems = [
	{ text: 'Less Than 10', color: 'success' },
	{ text: 'Less Than 20', color: 'primary' },
	{ text: 'Less Than 30', color: 'warning' },
	{ text: 'Less Than 40', color: 'info' },
	{ text: 'Less Than 50', color: 'danger' },
	{ text: 'Less Than 60', color: 'secondary' },
	{ text: 'Less Than 70', color: 'success' },
	{ text: 'Less Than 80', color: 'warning' },
	{ text: 'Less Than 90', color: 'info' },
	{ text: 'Less Than 100', color: 'danger' },
];

const subtractionItems = additionItems;

interface Props {}

interface BodyContainerState {
	range: string;
	operation: string;
}

class BodyContainer extends React.Component<Props, BodyContainerState> {
	constructor(props: Props) {
		super(props);
		this.state = { range: '', operation: 'Addition' };
	}

	getRange = (range: string) => {
		this.setState({ range });
	};

	setOperation = (op: string) => {
		this.setState({ operation: op, range: '' });
	};

	render() {
		const items = this.state.operation === 'Addition' ? additionItems : subtractionItems;
		return (
			<div className="body-container">
				<SideBar
					className="side-bar"
					header="Addition"
					operation={this.state.operation}
					onOperationChange={this.setOperation}
					items={items}
					chooseRange={this.getRange}
				/>
				<MainContentContainer
					className="main-container"
					range={this.state.range}
					operation={this.state.operation}
				/>
			</div>
		);
	}
}

export default BodyContainer;
 
