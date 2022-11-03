interface SegmentRule {
  _id: string; // "5e7cf262-972d-4b91-a321-3a61a0676c96",
  clauses: Array<{
    _id: string; // 'f7a38f59-df28-45a8-a19a-942c59ba9730';
    attribute: string; // 'created_at';
    op: string; // 'lessThanOrEqual';
    values: Array<unknown>; // [1647380501];
    negate: boolean; // false;
  }>;
}
export interface SegmentItem {
  name: string; // 'My Segment',
  tags: Array<unknown>;
  creationDate: number; // 1611167195896
  key: string; // 'my-segment',
  included: Array<string>; // ['user-1','user-2']
  excluded: Array<string>;
  rules: Array<SegmentRule>;
  version: number; // 9
  deleted: boolean; // false
  generation: number; // 0
}
