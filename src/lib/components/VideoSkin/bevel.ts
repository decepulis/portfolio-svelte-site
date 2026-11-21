// HTML 3.2 tables are "rendered in bas-relief, raised up with the outer border as a bevel, and
// individual cells inset into this raised surface." Light falls from the top left.

/** A table's outer border, raised from the page. */
export const raised =
	'border border-gray border-t-silver border-l-silver dark:border-t-white dark:border-l-white';

/** A cell, inset into its table. */
export const sunken =
	'border border-gray border-r-silver border-b-silver dark:border-r-white dark:border-b-white';
