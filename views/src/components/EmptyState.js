import React from 'react';
import image from '../assets/albums.svg';

const EmptyState = () =>
	<div className="empty-state">
		<img src={image} alt="broken gallery" />
		<h2>Aww shoot</h2>
		<p>Looks like there aren't any pictures submitted. Hit the upload button to get some pictures in!</p>
	</div>

export default EmptyState
