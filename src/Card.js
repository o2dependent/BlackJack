import React, { Component } from 'react';
import './Card.css';

class Card extends Component {

	render() {
		let { imgURL, alt, transform } = this.props;
		return <img style={{transform: transform}} className="Card" src={imgURL} alt={alt} />;
	}
}

export default Card;
