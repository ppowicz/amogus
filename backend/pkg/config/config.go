package config

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	ApiUrl       string `json:"api_url"`
	FrontUrl     string `json:"front_url"`
	JwtSecret    string `json:"jwt_secret"`
	GithubClient string `json:"github_client"`
	GithubSecret string `json:"github_secret"`
	GoogleClient string `json:"google_client"`
	GoogleSecret string `json:"google_secret"`
}

func Load(path string) (cfg *Config, err error) {
	cfg = new(Config)

	f, err := ioutil.ReadFile(path)
	if err != nil {
		return
	}

	err = json.Unmarshal(f, cfg)
	return
}
