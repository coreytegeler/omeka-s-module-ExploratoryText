<?php
namespace ExploratoryText\Site\BlockLayout;

use Zend\Form\Element\Textarea;
use Omeka\Api\Representation\SiteRepresentation;
use Omeka\Api\Representation\SitePageRepresentation;
use Omeka\Api\Representation\SitePageBlockRepresentation;
use Omeka\Entity\SitePageBlock;
use Omeka\Site\BlockLayout\AbstractBlockLayout;
use Omeka\Stdlib\ErrorStore;
use Zend\View\Renderer\PhpRenderer;
use Zend\ServiceManager\ServiceLocatorInterface;

class ExploratoryText extends AbstractBlockLayout
{
	public function getLabel()
	{
		return 'Exploratory Text (Primary)'; // @translate
	}

	public function prepareForm( PhpRenderer $view )
	{
		$view->headLink()->appendStylesheet( $view->assetUrl( 'exploratory-text.css', 'ExploratoryText') );
	}

	public function form( PhpRenderer $view, SiteRepresentation $site, SitePageRepresentation $page = null, SitePageBlockRepresentation $block = null
	 ) {
		$html = '';

		$bodyInput = new Textarea( 'o:block[__blockIndex__][o:data][body]' );
		$bodyInput->setOptions([
			'label' => 'Body',
			'info' => '',
		]);
		$bodyValue = $block ? $block->dataValue('body') : null;
		$bodyInput->setAttributes([
			'value' => $bodyValue,
			'class' => 'block-html full wysiwyg'
		]);
		$html .= '<div class="et-inner">' . $view->formRow($bodyInput) . '</div>';

		$html .= $view->blockAttachmentsForm($block);
		
		return $html;

	}

	public function render( PhpRenderer $view, SitePageBlockRepresentation $block )
	{
		$ver = 1.2;
		$view->headLink()->appendStylesheet( $view->assetUrl( 'exploratory-text.css?version='.$ver, 'ExploratoryText' ) );
		$view->headScript()->appendFile( 'https://d3js.org/d3.v5.min.js', 'text/javascript' );
		$view->headScript()->appendFile( $view->assetUrl( 'exploratory-text.js?version='.$ver, 'ExploratoryText' ), 'text/javascript' );


		$reference = array();
		$atchs = $block->attachments();
		if( sizeof( $atchs ) ) {
			$atch = $atchs[0];
			$item = $atch->item();
			if( is_object( $item ) ) {
				$reference['title'] = $item->displayTitle();
				$reference['url'] = $item->url();
				$reference['citation'] = $item->value( 'dcterms:bibliographicCitation' )->value();
				$media = $atch->media() ?: $item->primaryMedia();
				$reference['image'] = $media ? $view->thumbnail( $media, 'medium' ) : null;
			}
		}

		return $view->partial( 'common/block-layout/exploratory-text-block', [
			'block' => $block,
			'reference' => $reference
		]);
	}
}