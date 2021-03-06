<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service
 * @DI\Tag("twig.extension")
 */
class HasRoleExtension extends \Twig_Extension
{
    private $securityContext;

    /**
     * @DI\InjectParams({
     *     "securityContext" = @DI\Inject("security.context")
     * })
     */
    public function __construct($securityContext)
    {
        $this->securityContext = $securityContext;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            'has_role' => new \Twig_Function_Method($this, 'hasRole'),
            'is_impersonated' => new \Twig_Function_Method($this, 'isImpersonated'),
        );
    }

    public function hasRole($role)
    {
        if ($token = $this->securityContext->getToken()) {
            foreach ($token->getRoles() as $tokenRole) {
                if ($tokenRole->getRole() === $role) {
                    return true;
                }
            }
        }

        return false;
    }

    public function isImpersonated()
    {
        if ($token = $this->securityContext->getToken()) {
            foreach ($token->getRoles() as $role) {
                if ($role instanceof \Symfony\Component\Security\Core\Role\SwitchUserRole) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get the name of the twig extention.
     *
     * @return \String
     */
    public function getName()
    {
        return 'has_role_extension';
    }
}
