module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    message: "widget-config API works"
  })
}