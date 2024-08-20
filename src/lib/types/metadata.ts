interface BaseMetadata {
	pathname: string;
	title?: string;
	fullTitle?: string;
	description?: string;
	image?: {
		url: string;
		width?: number;
		height?: number;
		alt?: string;
	};
	profile?: boolean;
	article?: {
		publishedTime?: Date;
		modifiedTime?: Date;
		expirationTime?: Date;
		section?: string;
		tags?: string[];
	};
}
interface TitleMetadata extends BaseMetadata {
	title: string;
	fullTitle?: string;
}
interface FullTitleMetadata extends BaseMetadata {
	title?: string;
	fullTitle: string;
}
export type Metadata = TitleMetadata | FullTitleMetadata;
