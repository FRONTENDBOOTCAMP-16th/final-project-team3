-- ──────────────────────────────────────────────
-- 기존 함수
-- ──────────────────────────────────────────────

-- 신고 수 증가
CREATE OR REPLACE FUNCTION increment_report_count(post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY INVOKER AS $$
  UPDATE posts SET report_count = report_count + 1 WHERE id = post_id;
$$;

-- 조회수 증가
CREATE OR REPLACE FUNCTION increment_view_count(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$;

-- updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ──────────────────────────────────────────────
-- 댓글 어뷰징 방지 함수 및 트리거
-- ──────────────────────────────────────────────

-- 1) 쿨타임: 마지막 댓글 작성 시각 조회
CREATE OR REPLACE FUNCTION get_last_comment_time(p_user_id uuid)
RETURNS timestamptz
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT created_at
  FROM comments
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- 2) 중복: 최근 N개 댓글 내용 조회
CREATE OR REPLACE FUNCTION get_recent_comments_content(
  p_user_id  uuid,
  p_post_id  uuid,
  p_limit    int DEFAULT 3
)
RETURNS TABLE(content text)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT content
  FROM comments
  WHERE user_id = p_user_id
    AND post_id = p_post_id
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

-- 3) 연속 작성: 게시물의 마지막 N개 댓글 작성자 조회
CREATE OR REPLACE FUNCTION get_recent_commenters(
  p_post_id  uuid,
  p_limit    int DEFAULT 3
)
RETURNS TABLE(user_id uuid)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT user_id
  FROM comments
  WHERE post_id = p_post_id
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

-- 4) 쿨타임 트리거 함수: 동시 요청 우회 차단
CREATE OR REPLACE FUNCTION check_comment_cooltime()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  last_time TIMESTAMPTZ;
BEGIN
  SELECT created_at INTO last_time
  FROM comments
  WHERE user_id = NEW.user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF last_time IS NOT NULL AND
     EXTRACT(EPOCH FROM (NOW() - last_time)) < 10 THEN
    RAISE EXCEPTION 'COOLTIME: % seconds remaining',
      CEIL(10 - EXTRACT(EPOCH FROM (NOW() - last_time)));
  END IF;

  RETURN NEW;
END;
$$;

-- 5) 트리거 등록: comments INSERT 전에 쿨타임 검사
CREATE OR REPLACE TRIGGER enforce_comment_cooltime
  BEFORE INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION check_comment_cooltime();