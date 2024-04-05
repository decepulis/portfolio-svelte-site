export type LinkType = 'external' | 'info' | 'github';
export interface Technology {
	name: string;
	details?: string;
}
export interface Link {
	type: LinkType;
	href: string;
}

interface BaseProject {
	header: string;
	summary: string;
	technologies: Technology[];
	links?: Link[];
	width: number;
	height: number;
	alt: string;
}
interface ProjectWithImage extends BaseProject {
	imageSite: string;
	imagePath: string;
}
interface ProjectWithStaticVideo extends BaseProject {
	videoPath: string;
}
export type Project = ProjectWithImage | ProjectWithVideo;
export const isProjectWithImage = (project: Project): project is ProjectWithImage => {
	return typeof (project as ProjectWithImage).imagePath !== 'undefined';
};
export const isProjectWithStaticVideo = (project: Project): project is ProjectWithStaticVideo => {
	return typeof (project as ProjectWithStaticVideo).videoPath !== 'undefined';
};
