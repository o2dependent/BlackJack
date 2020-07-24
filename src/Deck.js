import React, { Component } from 'react';
import Axios from 'axios';
import Hand from './Hand';
import './Deck.css';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

class Deck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deck: null,
			drawnCards: [],
			plrCards: [],
			dlrCards: [],
			plrCount: 0,
			dlrCount: 0,
			gameActive: false,
			plrTurn: false,
			winner: '',
		};
	}

	componentDidMount() {
		this.newDeck();
	}

	newDeck = async () => {
		let deck = await Axios.get(`${API_BASE_URL}/new/shuffle`);
		this.setState({ deck: deck.data });
	};

	getCard = async (player) => {
		console.log(player + ': getCard');
		try {
			let playerCards = player + 'Cards';
			let cardGet = await Axios.get(
				`${API_BASE_URL}/${this.state.deck.deck_id}/draw/`
			);
			if (!cardGet.data.success) {
				throw new Error('No cards remaining');
			}
			let card = cardGet.data.cards[0];
			let cardFormatted = {
				code: card.code,
				image: card.image,
				alt: `${card.value} OF ${card.suit}`,
				value: card.value,
			};
			await this.setState((st) => ({
				[playerCards]: [...st[playerCards], cardFormatted],
			}));
			this.countCards(player);
		} catch (err) {
			console.log(err);
		}
	};

	stay = () => {
		console.log('stay');
		this.setState({ plrTurn: false });
		this.dealerTurn();
	};

	dealerTurn = async () => {
		console.log('dealer turn');
		let dCount = this.state.dlrCount < 17;
		while (dCount) {
			console.log('dealer draw');
			await this.getCard('dlr');
			dCount = this.state.dlrCount < 17;
		}
		if (this.state.winner === '') {
			this.setState((st) => ({
				winner: st.plrCount >= st.dlrCount ? 'Player' : 'Dealer',
			}));
		}
	};

	newGame = async () => {
		await this.setState({
			deck: null,
			drawnCards: [],
			plrCards: [],
			dlrCards: [],
			plrCount: 0,
			dlrCount: 0,
			gameActive: true,
			winner: '',
			plrTurn: true,
		});
		await this.newDeck();
		for (let i = 0; i < 2; i++) {
			this.getCard('plr');
			this.getCard('dlr');
		}
	};

	countCards = (player) => {
		console.log(player + ': countCards');
		const cards = this.state[player + 'Cards'],
			curCount = this.state[player + 'Count'];
		let newCount = 0,
			aces = [];
		if (cards.length < 2) {
			return;
		}
		cards.forEach((c) => {
			let v = c.value;
			if (Number(v)) {
				newCount += Number(v);
			} else if (v !== 'ACE') {
				newCount += 10;
			} else {
				aces.push(c);
			}
		});
		aces.forEach((c) => {
			if (curCount + 11 > 21) {
				newCount += 1;
			} else {
				newCount += 11;
			}
		});
		if (newCount <= 21) {
			this.setState({ [player + 'Count']: newCount });
		} else {
			console.log(player + ': BUST WITH ' + newCount);
			console.log(player === 'plr');
			this.setState({
				winner: player === 'plr' ? 'Dealer' : 'Player',
				[player + 'Count']: newCount,
			});
		}
	};

	show = () => {
		if (!this.state.gameActive) {
			return (
				<div className='Deck-Card-Container'>
					<h1 className='Deck-title'>Blackjack</h1>
					<h2 className='Deck-title subtitle'>React API demo</h2>
					<button className='Deck-btn' onClick={this.newGame}>
						Start Game
					</button>
				</div>
			);
		} else {
			return (
				<div className='Deck-Card-Container'>
					{this.state.winner !== '' && (
						<div>
							<h2 className='Deck-title subtitle'>
								{this.state.winner} Wins.
							</h2>
							<button className='Deck-btn' onClick={this.newGame}>
								Start Game
							</button>
						</div>
					)}
					<Hand
						active={this.state.plrTurn && this.state.winner === ''}
						player={'dlr'}
						draw={this.getCard}
						cards={this.state.dlrCards}
					/>
					<Hand
						stay={this.stay}
						player={'plr'}
						active={this.state.plrTurn && this.state.winner === ''}
						count={this.state.plrCount}
						draw={this.getCard}
						cards={this.state.plrCards}
					/>
				</div>
			);
		}
	};

	render() {
		return <div className='Deck'>{this.show()}</div>;
	}
}

export default Deck;
