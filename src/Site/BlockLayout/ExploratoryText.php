<?php
namespace ExploratoryText\Site\BlockLayout;

use Zend\Form\Element\Select;
use Zend\Form\Element\Text;
use Zend\Form\Element\Textarea;
use Omeka\Form\Element\HtmlTextarea;
use Omeka\Form\Element\ResourceSelect;
use Omeka\Form\Element\ItemSetSelect;
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
		return 'Exploratory Text'; // @translate
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
		$html .= $view->formRow($bodyInput);
		
		return $html;

	}

	public function render( PhpRenderer $view, SitePageBlockRepresentation $block )
	{
		$view->headLink()->appendStylesheet( $view->assetUrl( 'exploratory-text.css', 'ExploratoryText' ) );
		$view->headScript()->appendFile( 'https://d3js.org/d3.v5.min.js', 'text/javascript' );
		$view->headScript()->appendFile( $view->assetUrl( 'exploratory-text.js', 'ExploratoryText' ), 'text/javascript' );


		return $view->partial( 'common/block-layout/exploratory-text-block', [
			'block' => $block,
		]);
	}
}