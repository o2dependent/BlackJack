import React, { Component } from 'react';
import Card from './Card';
import './Hand.css';

class Hand extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleHit = () => {
		this.props.draw(this.props.player);
	};

	handleStay = () => {
		this.props.stay(this.props.player);
	};

	makeHand = () => {
		const p = this.props;
		if (p.cards.length > 0) {
			return p.cards.map((c, i) =>
				p.active && p.player === 'dlr' && i === 1 ? (
					<Card
						key={'cardBack'}
						imgURL={'./cardback.webp'}
						alt={'Card Back'}
					/>
				) : (
					<Card
						key={c.code}
						imgURL={c.image}
						alt={c.alt}
						transform={c.transform}
					/>
				)
			);
		}
	};

	render() {
		return (
			<div>
				{this.makeHand()}
				{this.props.player === 'plr' && this.props.active && (
					<div className='Hand-btn-container'>
						{this.props.count !== 21 && (
							<button
								className='Hand-btn hit'
								onClick={this.handleHit}
							>
								Hit
							</button>
						)}
						<button
							className='Hand-btn stay'
							onClick={this.handleStay}
						>
							Stay
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default Hand;
