package utils

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/argon2"
)

type PasswordConfig struct {
	Time    uint32
	Memory  uint32
	Threads uint8
	KeyLen  uint32
}

// Generate hash from given password
func GeneratePassword(c *PasswordConfig, passwd string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(passwd), salt, c.Time, c.Memory, c.Threads, c.KeyLen)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	format := "$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s"
	full := fmt.Sprintf(format, argon2.Version, c.Memory, c.Time, c.Threads, b64Salt, b64Hash)

	return full, nil
}

// Compare hash with given password
func ComparePasswords(password, hash string) (bool, error) {
	parts := strings.Split(hash, "$")

	c := &PasswordConfig{}
	_, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &c.Memory, &c.Time, &c.Threads)
	if err != nil {
		return false, err
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, err
	}

	decodedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, err
	}
	c.KeyLen = uint32(len(decodedHash))

	comparisonHash := argon2.IDKey([]byte(password), salt, c.Time, c.Memory, c.Threads, c.KeyLen)

	return (subtle.ConstantTimeCompare(decodedHash, comparisonHash) == 1), nil
}

// function that return the current date time in the format YYYY-MM-DD HH:MM:SS
func GetCurrentDateTime() string {
	t := time.Now()
	return t.Format("2006-01-02 15:04")
}

// function that set a cookie in the response using echo context
func SetCookie(c echo.Context, value string) {
	cookie := &http.Cookie{
		Name:     "current_user",
		Value:    value,
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
	}

	c.SetCookie(cookie)
}

// function that delete a cookie in the response using echo context
func DeleteCookie(c echo.Context) {
	cookie := &http.Cookie{
		Name:     "current_user",
		Value:    "",
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
		MaxAge:   -1,
	}

	c.SetCookie(cookie)
}

func HttpError(code int, message string) error {
	return echo.NewHTTPError(code, map[string]string{"message": message})
}

func fromJson(decode []byte) (interface{}, error) {
	var out interface{}
	err := json.Unmarshal(decode, &out)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// GetCache returns the value of the key in the cache if it exists
func CheckCache(cache *memcache.Client, key string) (interface{}, error) {
	cachedDetail, err := cache.Get(key)
	if err == nil {
		if cachedDetail.Value != nil {
			data, err := fromJson(cachedDetail.Value)
			if err != nil {
				return nil, err
			}
			return data, nil
		}
	}

	return nil, nil
}

// SetCache sets the value of the key in the cache
func SetCache(cache *memcache.Client, key string, value interface{}) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}

	item := &memcache.Item{
		Key:        key,
		Value:      data,
		Expiration: 300,
	}

	err = cache.Set(item)
	if err != nil {
		return err
	}

	return nil
}
