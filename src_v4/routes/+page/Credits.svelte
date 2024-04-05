<section id="credits" class="container">
	<h2>Credit Where Credit Is Due</h2>
	<blockquote>
		Lesser artists borrow; great artists steal.
		<footer>
			<cite>
				Pablo Picasso,
				<a target="_blank" href="https://www.uvu.edu/arts/applause/posts/stealing.html">kinda</a>
			</cite>
		</footer>
	</blockquote>
	<p>
		I <em>wish</em> I were creative enough to come up with all the cool things I did with this site!
		Don't get me wrong: nothing here is copy/paste, and I tried to make it my own. But I wouldn't have
		gotten here without some really great ideas, inspiration, and bug fixes from the following amazing
		developers:
	</p>
	<dl>
		<dt>Content Structure</dt>
		<dd>
			Thank You <a target="_blank" href="https://brittanychiang.com">Brittany Chiang</a>
		</dd>
		<dt>Interactive Profile Pic</dt>
		<dd>
			Thank You <a target="_blank" href="https://www.cassie.codes">Cassie Evans</a>
		</dd>
		<dt>Bio Length Selection</dt>
		<dd>
			Thank You <a target="_blank" href="https://chriscoyier.net">Chris Coyier</a>
		</dd>
		<dt>Boop</dt>
		<dd>
			Thank You <a target="_blank" href="https://www.joshwcomeau.com/react/boop/">Josh W. Comeau</a>
		</dd>
		<dt>Dark Mode <abbr title="Flash of unstyled content">FOUC</abbr> Solution</dt>
		<div>
			<dd>
				Thank You
				<a target="_blank" href="https://github.com/gaearon/overreacted.io/blob/master/src/html.js">
					Dan Abramov
				</a>
			</dd>
			<dd>
				Thank You <a target="_blank" href="https://www.joshwcomeau.com/react/dark-mode/">
					Josh W. Comeau
				</a>
			</dd>
		</div>
		<dt>Mood Board</dt>
		<dd>
			Thank You <a target="_blank" href="https://www.jackboxgames.com/fibbage-three/">Fibbage 3</a>
		</dd>
	</dl>
</section>

<style>
	dd {
		margin-left: 0;
		margin-bottom: 1rem;
	}
	div dd:not(:last-child) {
		margin-bottom: 0;
	}
	@media (min-width: 42rem) {
		dl,
		blockquote {
			text-align: initial;
		}
		dd {
			margin-bottom: 0;
		}
		dl {
			display: grid;
			grid-template-columns: auto auto;
			justify-content: start;
			gap: 0 1rem;
		}
	}
</style>
