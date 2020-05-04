<?php
namespace ExploratoryText\Site\BlockLayout;

use Zend\Form\Element\Select;
use Zend\Form\Element\Text;
use Zend\Form\Element\Textarea;
use Omeka\Api\Representation\SiteRepresentation;
use Omeka\Api\Representation\SitePageRepresentation;
use Omeka\Api\Representation\SitePageBlockRepresentation;
use Omeka\Entity\SitePageBlock;
use Omeka\Site\BlockLayout\AbstractBlockLayout;
use Omeka\Stdlib\ErrorStore;
use Zend\View\Renderer\PhpRenderer;
use Zend\ServiceManager\ServiceLocatorInterface;

class ExploratoryTextAnnotations extends AbstractBlockLayout
{
	public function getLabel()
	{
		return 'Exploratory Text (Annotation)'; // @translate
	}

	public function prepareForm( PhpRenderer $view )
	{
		// $view->headLink()->appendStylesheet( $view->assetUrl( 'css/exploratory-text-admin.css', 'ExploratoryText') );
	}

	public function form( PhpRenderer $view, SiteRepresentation $site, SitePageRepresentation $page = null, SitePageBlockRepresentation $block = null
	 ) {
		$html = '';

		$highlightInput = new Text( 'o:block[__blockIndex__][o:data][highlight]' );
		$highlightInput->setOptions([
			'label' => 'Highlighted Text',
		]);
		$highlightValue = $block ? $block->dataValue('highlight') : null;
		$highlightInput->setAttributes([
			'value' => $highlightValue,
		]);
		$html .= $view->formRow($highlightInput);

		$typeSelect = new Select("o:block[__blockIndex__][o:data][type]");
		$typeSelect->setOptions([
			'label' => 'Annotation Type',
			'info' => '',
		]);
		$typeSelect->setValueOptions([
			'context' => 'Context',
			'entity' => 'Entity',
			'primary' => 'Primary',
			'secondary' => 'Secondary',
		]);
		$typeValue = $block ? $block->dataValue('type') : null;
		$typeSelect->setAttributes([
			'value' => $typeValue
		]);
		$html .= $view->formRow($typeSelect);


		$bodyTextarea = new Textarea( 'o:block[__blockIndex__][o:data][body]' );
		$bodyTextarea->setOptions([
			'label' => 'Body',
			'info' => '',
		]);
		$bodyValue = $block ? $block->dataValue('body') : null;
		$bodyTextarea->setAttributes([
			'value' => $bodyValue,
			'class' => 'block-html full wysiwyg'
		]);
		$html .= $view->formRow($bodyTextarea);

		$citationTextarea = new Textarea( 'o:block[__blockIndex__][o:data][citation]' );
		$citationTextarea->setOptions([
			'label' => 'Citation',
			'info' => '',
		]);
		$citationValue = $block ? $block->dataValue('citation') : null;
		$citationTextarea->setAttributes([
			'value' => $citationValue,
			'class' => 'block-html full wysiwyg'
		]);
		$html .= $view->formRow($citationTextarea);

		// $atchUsageSelect = new Select("o:block[__blockIndex__][o:data][atchUsage]");
		// $atchUsageSelect->setOptions([
		// 	'label' => 'Attachment Usage',
		// 	'info' => '',
		// ]);
		// $atchUsageSelect->setValueOptions([
		// 	null => '',
		// 	'citation' => 'Citation',
		// 	'image' => 'Image',
		// 	'entity' => 'Entity',
		// ]);
		// $atchUsageValue = $block ? $block->dataValue('atchUsage') : null;
		// $atchUsageSelect->setAttributes([
		// 	'value' => $atchUsageValue
		// ]);
		// $html .= $view->formRow($atchUsageSelect);

		$html .= $view->blockAttachmentsForm($block);
		
		return $html;

	}

	public function render( PhpRenderer $view, SitePageBlockRepresentation $block )
	{
		$atchs = $block->attachments();
		$atchUsage = $block->dataValue( 'atchUsage' );
		$reference = array();

		if( sizeof( $atchs ) ) {
			$atch = $atchs[0];
			if( is_object( $atch ) ) {
				$item = $atch->item();
				if( is_object( $item ) ) {
					$reference['title'] = $item->link( $item->displayTitle(), null, array( 'target' => '_blank' ) );
					$media = $atch->media() ?: $item->primaryMedia();
					if( $media ) {
						$reference['image'] = $view->thumbnail( $media, 'medium' );
					}
				}
			}
		}

		return $view->partial( 'common/block-layout/exploratory-text-annotation-block', [
			'block' => $block,
			'reference' => $reference
		]);
	}
}