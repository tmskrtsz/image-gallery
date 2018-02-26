import React from 'react';
import Masonry from 'react-masonry-component';
import Image from './Image';
import EmptyState from './EmptyState';
import Loader from './Loader'
import axios from 'axios';

class Gallery extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			data: [],
			status: '',
			is404: false,
			isLoading: true,
		}
	}

	fetchImages() {
		axios.get('/api/images')
			.then((res) => {
				if (res.status !== 404) {
					this.setState({
						data: res.data,
						is404: false,
						isLoading: false
					});
				}
			})
			.catch((err) => {
				if (err.response.status === 404) {
					this.setState({
						is404: true,
						isLoading: false
					});
				}
			});
	}

	componentDidMount() {
		this.fetchImages();
	}

	componentWillReceiveProps() {
		setTimeout(() => {
			this.fetchImages();
		}, 200)
	}

	handleDelete = (path) => {
		axios.delete(`http://localhost:3001/api/delete/${path}`)
			.then(() => this.fetchImages())
			.catch((err) => console.log(err));
	}

 	render() {
		let payload = this.state.data;
		const masonryOptions = {
			columnWidth: 120,
			itemSelector: '.gallery-image',
			percentPosition: true,
			gutter: 12
		}

		return (
			<div className="gallery">
				<Masonry
					className={'gallery-masonry'}
					elementType={'div'}
					options={masonryOptions}
				>
					{ !this.state.is404 && !this.state.isLoading &&
						payload.map((image, index) =>
							<div key={index} className="gallery-image">
								<Image
									pathThumb={`http://localhost:3001/images/${image.pathThumb}`}
									pathFull={`http://localhost:3001/images/${image.path}`}
									alt={image.image}
								/>
								<button
									className="delete"
									onClick={() => this.handleDelete(image.path)}
								>
								Delete
								</button>
							</div>
						)
					}
				</Masonry>
				{
					this.state.is404 &&
						<EmptyState />
				}
				{
					this.state.isLoading &&
						<Loader />
				}
			</div>
		)
	}
}


export default Gallery
