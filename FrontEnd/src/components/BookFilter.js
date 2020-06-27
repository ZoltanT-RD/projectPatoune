import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { Row, Col } from 'react-materialize';
import CheckBoxCustom from './CheckBoxCustom';

import BookStatus from '../../../enums/BookRequestStatus';

///section css
import componentCSS from './BookFilter.scss';

class BookFilter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			bookStatusFilters: [
				{
					id: BookStatus.requested,
					label: 'Requested',
					value: BookStatus.requested,
					checked: true,
					onChange: () => {
						this.updateState(this.state.bookStatusFilters[0].id);
						console.log(
							'filter books by something innit + update checked state'
						);
					},
				},
				{
					id: BookStatus.ordered,
					label: 'Ordered',
					value: BookStatus.ordered,
					checked: true,
					onChange: () => {
						this.updateState(this.state.bookStatusFilters[1].id);
						console.log('what about now + update checked state');
					},
				},
				{
					id: BookStatus.available,
					label: 'Available',
					value: BookStatus.available,
					checked: true,
					onChange: () => {
						this.updateState(this.state.bookStatusFilters[2].id);
						console.log('fand now? + update checked state');
					},
				},
				{
					id: BookStatus.declined,
					label: 'Declined',
					value: BookStatus.declined,
					onChange: () => {
						this.updateState(this.state.bookStatusFilters[3].id);
						console.log('i give up + update checked state');
					},
				},
			],
		};

		this.updateState = this.updateState.bind(this);
	}

	render() {
		return (
			<div className={'book-filter'}>
				<Row>
					<Col s={12}>
						<h6>Filter by</h6>
					</Col>
				</Row>
				<Row>
					<Col s={12}>
						<div className="filters">
							<span>Status</span>

							{this.state.bookStatusFilters.map((e) => (
								<CheckBoxCustom
									key={uuidv4()}
									id={e.id}
									label={e.label}
									value={e.value}
									disabled={e.disabled}
									onChange={e.onChange}
									checked={e.checked}
									className={e.classes}
								/>
							))}
						</div>
					</Col>
				</Row>
			</div>
		);
	}

	updateState(id) {
		this.setState((prevState) => {
			let selected = prevState.bookStatusFilters.find((e) => e.id === id);

			selected.checked === true ? (selected.checked = false) : (selected.checked = true);

			return [selected];
		});
	}
}

export default BookFilter;
