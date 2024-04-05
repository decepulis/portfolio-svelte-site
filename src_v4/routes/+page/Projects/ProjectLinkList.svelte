<ul>
	<slot />
</ul>

<style>
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;

		/* align self to end of whatever container */
		float: right;
		align-self: flex-end;
		margin-top: auto !important;
	}
</style>
