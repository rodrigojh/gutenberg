/**
 * External dependencies
 */
import { find, get, includes, union } from 'lodash';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { ifCondition, compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { POST_FORMATS } from '../post-format';

const PostFormatSuggested = ( { suggestedPostFormat, suggestionText, onUpdatePostFormat } ) => (
	<Button isLink onClick={ () => onUpdatePostFormat( suggestedPostFormat ) }>
		{ suggestionText }
	</Button>
);

const PostFormatPanel = ( { suggestion, onUpdatePostFormat } ) => {
	const panelBodyTitle = [
		__( 'Tip:' ),
		(
			<span className="editor-post-publish-panel__link" key="label">
				{ __( 'Add a post format' ) }
			</span>
		),
	];

	return (
		<PanelBody initialOpen={ false } title={ panelBodyTitle } >
			<p>
				{ __( 'Your theme uses Post Formats. These offer styling tweaks that highlight different kinds of content–like images or videos.' ) }
			</p>
			<p>
				<PostFormatSuggested
					onUpdatePostFormat={ onUpdatePostFormat }
					suggestedPostFormat={ suggestion.id }
					suggestionText={ sprintf(
						__( 'Convert to "%1$s" format.' ),
						suggestion.caption
					) }
				/>
			</p>
		</PanelBody>
	);
};

const getSuggestion = ( supportedFormats, suggestedPostFormat ) => {
	const formats = POST_FORMATS.filter( ( format ) => includes( supportedFormats, format.id ) );
	return find( formats, ( format ) => format.id === suggestedPostFormat );
};

export default compose(
	withSelect( ( select ) => {
		const { getEditedPostAttribute, getSuggestedPostFormat } = select( 'core/editor' );
		const supportedFormats = get( select( 'core' ).getThemeSupports(), [ 'formats' ], [] );
		return {
			currentPostFormat: getEditedPostAttribute( 'format' ),
			suggestion: getSuggestion( supportedFormats, getSuggestedPostFormat() ),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onUpdatePostFormat( postFormat ) {
			dispatch( 'core/editor' ).editPost( { format: postFormat } );
		},
	} ) ),
	ifCondition( ( { suggestion, currentPostFormat } ) => suggestion && suggestion.id !== currentPostFormat ),
)( PostFormatPanel );
