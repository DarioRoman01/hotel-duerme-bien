package middlewares

import (
	"hotel/utils"
	"net/http"

	"github.com/labstack/echo/v4"
)

// function that checks if user is logged in and validate if the users has permissions based on the endpoint that he is trying to accesss
func IsLoggedIn(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		path := c.Path()
		if path == "/login" || path == "/logout" {
			return next(c)
		}

		cookie, err := c.Cookie("current_user")
		if err != nil {
			return utils.HttpError(http.StatusUnauthorized, "usted no esta logueado")
		}

		if cookie.Value != "gerente" && cookie.Value != "administrador" {
			return utils.HttpError(http.StatusUnauthorized, "usted no tiene permisos para acceder a esta pagina")
		}

		if path != "/staff" && path != "/staff/create" && path != "/staff/:id" {
			if cookie.Value != "gerente" {
				return utils.HttpError(http.StatusUnauthorized, "usted no tiene permisos de gerente para acceder a esta pagina")
			}
		} else {
			if cookie.Value != "administrador" {
				return utils.HttpError(http.StatusUnauthorized, "usted no tiene permisos de administrador para acceder a esta pagina")
			}
		}

		return next(c)
	}
}
