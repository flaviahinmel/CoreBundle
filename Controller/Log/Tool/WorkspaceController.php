<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\Log\Tool;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * Display logs in workspace's tool.
 */
class WorkspaceController extends Controller
{
    /**
     * @EXT\Route(
     *     "/{workspaceId}",
     *     name="claro_workspace_logs_show",
     *     requirements={"workspaceId" = "\d+"},
     *     defaults={"page" = 1}
     * )
     * @EXT\Route(
     *     "/{workspaceId}/{page}",
     *     name="claro_workspace_logs_show_paginated",
     *     requirements={"workspaceId" = "\d+", "page" = "\d+"},
     *     defaults={"page" = 1}
     * )
     *
     * @EXT\Method("GET")
     *
     * @EXT\ParamConverter(
     *      "workspace",
     *      class="ClarolineCoreBundle:Workspace\Workspace",
     *      options={"id" = "workspaceId", "strictId" = true}
     * )
     *
     * @EXT\Template("ClarolineCoreBundle:Tool/workspace/logs:logList.html.twig")
     *
     * Displays logs list using filter parameteres and page number
     *
     * @param $page int The requested page number.
     *
     * @return Response
     *
     * @throws \Exception
     */
    public function logListAction(Workspace $workspace, $page)
    {
        return $this->get('claroline.log.manager')->getWorkspaceList($workspace, $page);
    }
}
