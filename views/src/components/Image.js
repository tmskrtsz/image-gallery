import React from 'react';

class Image extends React.Component {
	constructor(props) {
		super(props)
		this.state = { isLightBoxActive: false }
	}

	handleLightBox = () => {
		this.setState({ isLightBoxActive: true })
	}

	closeLightBox = () => {
		this.setState({ isLightBoxActive: false })
	}

	render() {
		return (
			<div>
				<img
					onClick={() => this.handleLightBox()}
					src={this.props.pathThumb}
					alt={this.props.alt}
				/>
				{ this.state.isLightBoxActive &&
					<div className="lightbox" onClick={() => this.closeLightBox()}>
						<img
							src={this.props.pathFull}
							alt={this.props.alt}
						/>
					</div>
				}
			</div>
		)
	}
}
export default Image
