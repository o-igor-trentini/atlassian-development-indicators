package gjmodels

type issueFields struct {
	StatusCategoryChangedate      string       `json:"statuscategorychangedate"`
	FixVersions                   []string     `json:"fixVersions"`
	Resolution                    interface{}  `json:"resolution"` // objeto
	LastViewed                    string       `json:"lastViewed"`
	Priority                      interface{}  `json:"priority"` // objeto
	Labels                        []string     `json:"labels"`
	TimeEstimate                  *interface{} `json:"timeestimate"`
	AggregateTimeOriginalEstimate *interface{} `json:"aggregatetimeoriginalestimate"`
	Versions                      []string     `json:"versions"`
	IssueLinks                    []string     `json:"issuelinks"`
	Assignee                      *interface{} `json:"assignee"`
	Status                        interface{}  `json:"status"`             // objeto
	Components                    interface{}  `json:"components"`         // array
	Creator                       interface{}  `json:"creator"`            // objeto
	SubTasks                      interface{}  `json:"subtasks"`           // objeto array
	Reporter                      interface{}  `json:"reporter"`           // objeto
	AggregateProgress             interface{}  `json:"aggregateprogress"`  // objeto
	Progress                      interface{}  `json:"progress"`           // objeto
	Votes                         interface{}  `json:"votes"`              // objeto
	IssueType                     interface{}  `json:"issuetype"`          // objeto
	TimeSpent                     *interface{} `json:"timespent"`          // objeto
	Project                       interface{}  `json:"project"`            // objeto
	AggregateTimeSpent            *interface{} `json:"aggregatetimespent"` // objeto
	ResolutionDate                *string      `json:"resolutiondate"`
	WorkRatio                     int          `json:"workratio"`
	Watches                       interface{}  `json:"watches"` // objeto
	Created                       string       `json:"created"`
	Updated                       string       `json:"updated"`
	TimeOriginalEstimate          *interface{} `json:"timeoriginalestimate"`
	Description                   interface{}  `json:"description"` // objeto
	Security                      *interface{} `json:"security"`
	Summary                       string       `json:"summary"`
	Environment                   *interface{} `json:"environment"`
	DueDate                       *interface{} `json:"duedate"`
}

type Issue struct {
	Expand string      `json:"expand"`
	ID     string      `json:"id"`
	Key    string      `json:"key"`
	Self   string      `json:"self"`
	Fields issueFields `json:"fields"`
}
