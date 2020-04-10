<?php
return [
    'block_layouts' => [
        'invokables' => [
            'exploratoryText' => 'ExploratoryText\Site\BlockLayout\ExploratoryText',
            'exploratoryTextAnnotations' => 'ExploratoryText\Site\BlockLayout\ExploratoryTextAnnotations',
        ],
    ],
    'view_helpers' => [
        'factories' => [
            // 'blockAttachmentsForm' => Service\ViewHelper\ExploratoryText::class,
            // 'locationsBlockAttachmentsForm' => 'ExploratoryText\View\Helper\LocationsBlockAttachmentsForm',
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            OMEKA_PATH . '/modules/ExploratoryText/view',
        ],
    ],

];
